package com.example.demo.hexagonal_architecture.core.service.association;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isA;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.demo.hexagonal_architecture.adapter.dto.association.FieldDTO;
import com.example.demo.hexagonal_architecture.adapter.mapperDto.association.FieldDTOMapper;
import com.example.demo.hexagonal_architecture.core.enitity.association.AssociationEntity;
import com.example.demo.hexagonal_architecture.core.enitity.association.Field;
import com.example.demo.hexagonal_architecture.core.enitity.association.Position;
import com.example.demo.hexagonal_architecture.core.port.out.FieldAssocRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.aot.DisabledInAotMode;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {FieldServiceImpl.class})
@ExtendWith(SpringExtension.class)
@DisabledInAotMode
class FieldServiceImplDiffblueTest {
    @MockBean
    private FieldAssocRepository fieldAssocRepository;

    @MockBean
    private FieldDTOMapper fieldDTOMapper;

    @Autowired
    private FieldServiceImpl fieldServiceImpl;

    @Test
    void testFindByPosition() {
        // Arrange
        AssociationEntity association = new AssociationEntity();
        association.setFields(new ArrayList<>());
        association.setFinalSolutions("0123456789ABCDEF");
        association.setId(1L);
        association.setSolutions(new HashMap<>());

        Field field = new Field();
        field.setAssociation(association);
        field.setColumnPosition("0123456789ABCDEF");
        field.setId(1L);
        field.setPosition(Position.A1);
        field.setText("0123456789ABCDEF");
        Optional<Field> ofResult = Optional.of(field);
        when(fieldAssocRepository.findByPosition(Mockito.<Long>any(), Mockito.<Position>any())).thenReturn(ofResult);
        FieldDTO fieldDTO = new FieldDTO();
        when(fieldDTOMapper.apply(Mockito.<Field>any())).thenReturn(fieldDTO);

        // Act
        Optional<FieldDTO> actualFindByPositionResult = fieldServiceImpl.findByPosition(1L, Position.A1);

        // Assert
        verify(fieldDTOMapper).apply(isA(Field.class));
        verify(fieldAssocRepository).findByPosition(eq(1L), eq(Position.A1));
        assertTrue(actualFindByPositionResult.isPresent());
        assertSame(fieldDTO, actualFindByPositionResult.get());
    }

    /**
     * Method under test:
     * {@link FieldServiceImpl#findByAssociationIdAndColumnPosition(Long, String)}
     */
    @Test
    void testFindByAssociationIdAndColumnPosition() {
        // Arrange
        when(fieldAssocRepository.findByAssociationIdAndColumnPosition(Mockito.<Long>any(), Mockito.<String>any()))
                .thenReturn(new ArrayList<>());

        // Act
        List<FieldDTO> actualFindByAssociationIdAndColumnPositionResult = fieldServiceImpl
                .findByAssociationIdAndColumnPosition(1L, "0123456789ABCDEF");

        // Assert
        verify(fieldAssocRepository).findByAssociationIdAndColumnPosition(eq(1L), eq("0123456789ABCDEF"));
        assertTrue(actualFindByAssociationIdAndColumnPositionResult.isEmpty());
    }
}
